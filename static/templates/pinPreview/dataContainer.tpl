<table class="table">
    <thead>
        <tr>
            <th scope="col">Topic id</th>
            <th scope="col">Category</th>
            <th scope="col">Title</th>
            <th scope="col">View</th>
            <th scope="col">Upvote</th>
            <th scope="col">Time created</th>
            <th scope="col">Time modified</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <!-- BEGIN topics -->
        <tr>
            <td>{topics.tid}</td>
            <td>{topics.category.name}</td>
            <td>
                <a href="/topic/{topics.tid}" target="_blank">
                    {topics.title}
                </a>
            </td>
            <td>{topics.viewcount}</td>
            <td>{topics.upvotes}</td>
            <td>{topics.timestampISO}</td>
            <td>{topics.lastposttimeISO}</td>
            <td>
                <button class="btn btn-primary btn-pin" data-tid={topics.tid}>
                    <i class="fa fa-1x fa-thumb-tack"></i>
                </button>
            </td>
        </tr>
        <!-- END topics -->
    </tbody>
</table>